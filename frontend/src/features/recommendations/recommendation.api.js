import api from "../../services/axios";
export const getRecommendations=async()=>{
    const response=await api.get('/recommendation')
    return response.data
}