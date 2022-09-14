import { CandyMachineV2, Metaplex } from "@metaplex-foundation/js";
import { useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import PageHeading from "../components/PageHeading";
import { CANDY_MACHINE_ADDRESS } from "../lib/constants";

export default function Home() {
  const { connection } = useConnection();
  const [candyMachine, setCandyMachine] = useState<CandyMachineV2 | undefined>(undefined)

  const metaplex = Metaplex
    .make(connection)

  const candyMachines = metaplex.candyMachinesV2()

  async function fetchCandyMachine() {
    const fetched = await candyMachines
      .findByAddress({ address: CANDY_MACHINE_ADDRESS })

    console.log("Fetched candy machine!", fetched)
    setCandyMachine(fetched)
  }

  useEffect(() => {
    fetchCandyMachine()
  }, [])

  const canMint = candyMachine && candyMachine.itemsRemaining.toNumber() > 0

  return (
    <main className="flex flex-col gap-8">
      <PageHeading>Dinosaurs 'r' Us</PageHeading>

      <div className="basis-1/4">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 border border-transparent rounded-md cursor-pointer hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canMint}
        >
          Mint 1 {candyMachine ? candyMachine.symbol : "NFT"}! 🦖
        </button>
      </div>

      {candyMachine ? (
        <p className="text-white">
          {candyMachine.itemsMinted.toNumber()} / {candyMachine.itemsAvailable.toNumber()} minted!
        </p>
      ) : <p className="text-white">Loading...</p>
      }

      <hr />
    </main>
  )
}
