import{backendJson,type BackendResult}from"@/lib/api-client";import type{StudentProfile}from"@/types/student-self-service";
export function getProfile(token:string):Promise<BackendResult<{status:"success";data:StudentProfile}>>{return backendJson("/student/profile",{accessToken:token,method:"GET"})}
