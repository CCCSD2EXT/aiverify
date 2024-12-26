import { TestResults } from "@/app/types";

export async function getChecklists(): Promise<TestResults[]> {
    const res = await fetch(`http://127.0.0.1:4000/input_block_data/`, { //extract to /lib/fetchapis/
      cache: 'no-store', //might no need this
    });
  
    if (!res.ok) {
      throw new Error('Failed to fetch test results');
    }
  
    return res.json();
  }
  