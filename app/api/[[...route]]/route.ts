import { Redis } from '@upstash/redis/cloudflare'
import {Hono} from 'hono'
import { env } from 'hono/adapter'
import { handle } from 'hono/vercel'
export const runtime = "edge "
const app = new Hono().basePath("/api") // if we want to deploy this on vercel it need a bsepath of /api which is handled by the hono

// const token  = process.env  this is valid in the node js enviroment for accessing the env variables but in the cloudflare it is diffreent 
type EnvConfig = {
    UPSTASH_REDIS_REST_TOKEN : string,
    UPSTASH_REDIS_REST_URL : string,
}

app.get("/searchCountry", async (c)=> {

    try{


        const start = performance.now();
    // 
    const {UPSTASH_REDIS_REST_TOKEN,UPSTASH_REDIS_REST_URL} = env<EnvConfig>(c)
   const redis = new Redis({
    token : UPSTASH_REDIS_REST_TOKEN,
    url : UPSTASH_REDIS_REST_URL, // now we are connected to the database
   })

   // what is the user is querying we get that form the context(c)
   const query = c.req.query('q')?.toUpperCase();

  
   
   if(!query){
    return c.json({
        message : "Invalid enter the country"
    },{
        status : 400
    })
   }

   const res = [];  // this is array we return as response ;
   const rank =  Number(await redis.zrank("terms",query));

   if(rank!==null || rank!==undefined){
     const temp = await redis.zrange<string[]>("terms",rank,rank+100); // this will return an array of the element from rank to rank+100;
     for(const el of temp){
            if(!el.startsWith(query)){
                break;
            }
            if(el.endsWith("*")){
                res.push(el.substring(0,el.length-1));

            }
     }
   }

   const end =  performance.now();

   return c.json({
    result : res,
    duration : end-start,

   })

    }catch(err){
            console.log(err);
            return c.json({
                result : [],
                message : err,
                status : 500
            })

    }


})
export const GET = handle(app) // want to deply on vercel // used to dpely on vercel 
export default app as never  // cloudflare workers  // used to deploy on clouflare
