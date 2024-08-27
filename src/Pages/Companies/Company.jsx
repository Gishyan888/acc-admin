import { useParams } from "react-router-dom"

export default function Company() {
    const {id} = useParams()
    console.log("🚀 ~ Company ~ id:", id)
  return (
    <div>Company</div>
  )
}
