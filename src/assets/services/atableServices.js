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
            id: record.id,
            ...record.fields,
        };
    });
        
    } catch (error) {
      console.error(error.message);
    }
  }

  export const saveAreaName = async (areaName) => {
    
    const url= `${import.meta.env.VITE_API_URL_AIRTABLE_2HRS}`;
    const urlKey=`${import.meta.env.VITE_APIKEY_AIRTABLE}`;
    const payload = {
        fields: {
          name: areaName
        },
      };
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
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
  };

 export const deleteAreaName = async (areaName) => {
    const recordId = aTableData[areaName]; // Get the record ID from state

    if (!recordId) return; // If no record ID, do nothing

    const url = `${import.meta.env.VITE_API_URL_AIRTABLE_2HRS}/${recordId}`;
    const urlKey = `${import.meta.env.VITE_APIKEY_AIRTABLE}`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${urlKey}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to delete: ${response.status}`);
        }
    } catch (error) {
        console.error(error.message);
    }
};

 