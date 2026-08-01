import{backendJson,type BackendResult}from"@/lib/api-client";import type{PageResponse,StudentDocument}from"@/types/student-self-service";
export function listDocuments(token:string):Promise<BackendResult<PageResponse<StudentDocument>>>{return backendJson("/student/documents?page=1&page_size=100",{accessToken:token,method:"GET"})}
