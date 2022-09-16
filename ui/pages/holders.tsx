import { Metadata, Metaplex, Nft } from "@metaplex-foundation/js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import NftDisplay from "../components/NftDisplay"
import PageHeading from "../components/PageHeading"
import { COLLECTION_MINT_ADDRESS } from "../lib/constants"

export default function Holders() {
  const { connection } = useConnection()
  const wallet = useWallet()
  const [userNfts, setUserNfts] = useState<Nft[]>([])

  const metaplex = Metaplex
    .make(connection)

  const nfts = metaplex.nfts()

  async function getUserNfts() {
    if (!wallet.publicKey) {
      setUserNfts([])
      return
    }

    // Fetch all the user's NFTs
    const userNfts = await nfts
      .findAllByOwner({ owner: wallet.publicKey })

    // Filter to our collection
    const ourCollectionNfts = userNfts.filter(
      metadata =>
        metadata.collection !== null &&
        metadata.collection.verified &&
        metadata.collection.address.toBase58() === COLLECTION_MINT_ADDRESS.toBase58()
    )

    // Load the JSON for each NFT 
    const loadedNfts = await Promise.all(ourCollectionNfts
      .map(metadata => {
        return nfts
          .load({ metadata: metadata as Metadata })
      })
    )

    console.log("Got their NFTs!", loadedNfts)
    setUserNfts(loadedNfts as Nft[])
  }

  useEffect(() => {
    getUserNfts()
  }, [wallet.publicKey])


  if (userNfts.length === 0) {
    return (
      <PageHeading>Holders only! ☠️</PageHeading>
    )
  }

  return (
    <main className="flex flex-col gap-8">
      <PageHeading>Hello awesome holder!</PageHeading>

      <p className="text-lg text-white">Here is the secret information! ✅</p>

      <div className="grid grid-cols-2 gap-4">
        {userNfts.map((userNft, i) => (
          <NftDisplay key={i} json={userNft.json} />
        ))}
      </div>
    </main>
  )
}
