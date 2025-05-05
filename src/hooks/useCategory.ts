import axios from "axios";

export default async function useCategory({
  categoryFor,
}: {
  categoryFor: string;
}) {
  try {
    const response = await axios.get(`/api/category?for=${categoryFor}`);
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
}
