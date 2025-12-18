import React from 'react'
import { useFetchUserMe } from '../Queries/UserQuery'
const Test = () => {
const {data} = useFetchUserMe()
console.log(data)

  return (
    <div>Test</div>
  )
}

export default Test