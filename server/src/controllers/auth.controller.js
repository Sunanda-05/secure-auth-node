export const loginUser = async (request, response) => {
  console.log("This is Login User");
  console.log(await request.body);
  
  return response.json({"messsage":"Login User"})
};
