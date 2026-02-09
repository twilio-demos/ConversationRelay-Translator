import { UserProfile } from "@/types/profile";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "";

// Convert UserProfile to DynamoDB format
export function profileToDynamoDB(profile: UserProfile): any {
  return {
    pk: profile.phoneNumber,
    sk: "profile",
    pk1: "profile",
    sk1: profile.phoneNumber,
    name: profile.name,
    calleeDetails: profile.calleeDetails,
    calleeLanguage: profile.calleeLanguage,
    calleeLanguageCode: profile.calleeLanguageCode,
    calleeLanguageFriendly: profile.calleeLanguageFriendly,
    calleeNumber: profile.calleeNumber,
    calleeTranscriptionProvider: profile.calleeTranscriptionProvider,
    calleeTtsProvider: profile.calleeTtsProvider,
    calleeVoice: profile.calleeVoice,
    sourceLanguage: profile.sourceLanguage,
    sourceLanguageCode: profile.sourceLanguageCode,
    sourceLanguageFriendly: profile.sourceLanguageFriendly,
    sourceTranscriptionProvider: profile.sourceTranscriptionProvider,
    sourceTtsProvider: profile.sourceTtsProvider,
    sourceVoice: profile.sourceVoice,
  };
}

// Convert DynamoDB format to UserProfile
export function dynamoDBToProfile(item: any): UserProfile {
  return {
    phoneNumber: item.pk,
    name: item.name,
    calleeDetails: item.calleeDetails,
    calleeLanguage: item.calleeLanguage,
    calleeLanguageCode: item.calleeLanguageCode,
    calleeLanguageFriendly: item.calleeLanguageFriendly,
    calleeNumber: item.calleeNumber,
    calleeTranscriptionProvider: item.calleeTranscriptionProvider,
    calleeTtsProvider: item.calleeTtsProvider,
    calleeVoice: item.calleeVoice,
    sourceLanguage: item.sourceLanguage,
    sourceLanguageCode: item.sourceLanguageCode,
    sourceLanguageFriendly: item.sourceLanguageFriendly,
    sourceTranscriptionProvider: item.sourceTranscriptionProvider,
    sourceTtsProvider: item.sourceTtsProvider,
    sourceVoice: item.sourceVoice,
  };
}

// Create or update a profile
export async function putProfile(profile: UserProfile): Promise<void> {
  const item = profileToDynamoDB(profile);

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  });

  await docClient.send(command);
}

// Get a profile by phone number
export async function getProfile(
  phoneNumber: string
): Promise<UserProfile | null> {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      pk: phoneNumber,
      sk: "profile",
    },
  });

  const response = await docClient.send(command);
  return response.Item ? dynamoDBToProfile(response.Item) : null;
}

// List all profiles
export async function listProfiles(): Promise<UserProfile[]> {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "index-1-full",
    KeyConditionExpression: "pk1 = :pk1",
    ExpressionAttributeValues: {
      ":pk1": "profile",
    },
  });

  const response = await docClient.send(command);
  return response.Items ? response.Items.map(dynamoDBToProfile) : [];
}

// Delete a profile
export async function deleteProfile(phoneNumber: string): Promise<void> {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      pk: phoneNumber,
      sk: "profile",
    },
  });

  await docClient.send(command);
}
