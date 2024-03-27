import { useState } from "react";
import axios from "axios";

const  useData = () => {
  const [inventoryData, setInventoryData] = useState([])

    const getData = () => {
        axios.get(`https://dev-0tf0hinghgjl39z.api.raw-labs.com/inventory`)
        .then(res => {
          if (res?.data) {
            setInventoryData(res?.data)
          }
      })
        .catch((error) => {
            console.log("Error: ", error);
        });
    };
    
  return {
    getData,
    inventoryData
  }
}

export default useData;