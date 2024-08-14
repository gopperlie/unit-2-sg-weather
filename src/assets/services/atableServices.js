export async function get2hrAirtable() {

    const url= `${import.meta.env.VITE_API_URL_AIRTABLE_2HRS}`;
    const urlKey=`${import.meta.env.VITE_APIKEY_AIRTABLE}`;
 
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            `Bearer ${urlKey}`,
        },
    });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();

      return json.records.map((record) => {
        return {
            ...record.fields,
        };
    });
        
    } catch (error) {
      console.error(error.message);
    }
  }

  export const createPet = async (formData) => {
    
    const url = "https://api.airtable.com/v0/app2nl3LLXTP4Siql/Table%201";
    const payload = {fields: {...formData, age: Number(formData.age)}}
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer patV8bqFMeWK4dWVx.bf64718d7be7e701c5dfb8e580b5ec9fa1eb877251bdb0e763602d77f578124d",
        },
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      const result = { id: json.id, ...json.fields };
      return result;
    } catch (error) {
      console.error(error.message);
    }
  };
  
