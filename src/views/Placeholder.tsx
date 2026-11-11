interface PlaceholderProps {
  name: string
}

function Placeholder({ name }: PlaceholderProps) {
  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
      <p className="mt-2 text-gray-500">這一頁還沒從 Vue 轉過來</p>
    </div>
  )
}

export default Placeholder
