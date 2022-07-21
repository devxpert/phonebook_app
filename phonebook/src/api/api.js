import axios from "axios";

const token = "feaace0f9b9283f7840f4a0b9e3969d62ad071e65ca5d435c1e8a2d8e91e";

const url = "http://localhost:8080/contacts";
// get Data from API
export const getApiData = async () => {
    const response = await axios.get(url);
    return response.data;
    }

// post with Authorization postApiData
export const postApiData = async (data) => {

    const response = await axios.post(url, data, {
        headers: {
            'Access-Control-Allow-Origin' : '*',
            // Authorization: "Bearer " + token
        }
    });
    return response.data;
    }
    

// put with Authorization putApiData
export const putApiData = async (data) => {
    const putUrl = "https://gorest.co.in/public/v2/users";
    const response = await axios.put(putUrl, data, {
        headers: {
            Authorization: "Bearer " + token
        }
    });
    return response.data;
}


// delete with Authorization deleteApiData
export const deleteApiData = async (data) => {
    const deleteUrl = "https://gorest.co.in/public/v2/users";
    const response = await axios.delete(deleteUrl, {
        headers: {
            Authorization: "Bearer " + token
        }
    });
    return response.data;
}

