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
    
    const url = "h";
    const payload = {fields: {...formData, age: Number(formData.age)}}
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer ",
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
  
