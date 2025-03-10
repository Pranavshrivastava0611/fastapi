"use client"; // this tell the next to render the page in client side

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [searchResult, setsearchResult] = useState<{
    result: string[];
    duration: number;
  }>();

  useEffect(() => {
    const fetchData = async () => {
      if (!input) return setsearchResult(undefined);
      const res = await fetch(`/api/searchCountry?q=${input}`); // there is no endpoint to receive (but we setup a backend to catch it maybe it can be next js route or it can be a backend framework )
      console.log(res)
      const data = (await res.json()) as { result: string[]; duration: number }
      
      setsearchResult(data)
    };
    fetchData();
    
  }, [input]);

  return (
    <main className='h-screen w-screen grainy'>
      <div className='flex flex-col gap-6 items-center pt-32 duration-500 animate-in animate fade-in-5 slide-in-from-bottom-10 spin-in-180'>
        <h1 className='text-5xl tracking-tight font-bold'>HyperFast 🔥</h1>
        <p className='text-zinc-600 text-lg max-w-prose text-center'>
          A very high-performance API built with Hono, Next.js and Cloudflare. <br />{' '}
          
        </p>

        <div className='max-w-md w-full'>
          <Command>
            <CommandInput
              value={input}
              onValueChange={setInput}
              placeholder='Search countries...'
              className='placeholder:text-zinc-500'
            />
            <CommandList>
             

              {searchResult?.result ? (
                <CommandGroup heading='Results'>
                  {searchResult?.result.map((result) => (
                    <CommandItem
                      key={result}
                      value={result}
                      onSelect={setInput}>
                      {result}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}

              {searchResult?.result ? (
                <>
                  <div className='h-px w-full bg-zinc-200' />

                  <p className='p-2 text-xs text-zinc-500'>
                    Found {searchResult.result.length} results in{' '}
                    {searchResult?.duration.toFixed(0)}ms
                  </p>
                </>
              ) : null}
            </CommandList>
          </Command>
        </div>
      </div>
    </main>
  )

}
