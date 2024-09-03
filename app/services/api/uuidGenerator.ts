import UUIDGenerator from "react-native-uuid-generator"

export default async function generateUUID() {
  return await UUIDGenerator.getRandomUUID()
}
