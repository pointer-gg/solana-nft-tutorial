import { JsonMetadata } from "@metaplex-foundation/js"

interface NftProps {
  json: JsonMetadata<string>
}

export default function NftDisplay({ json }: NftProps) {
  const arms = json.attributes?.find(a => a.trait_type === "arms").value

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-medium text-white">{json.name}</h3>
      <img src={json.image} alt={json.name} />
      <p className="text-sm text-white"><span className="font-bold">Arms: </span>{arms}</p>
    </div>
  )
}
