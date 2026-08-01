import {backendJson,type BackendResult}from"@/lib/api-client";import type{StudentApplication}from"@/types/student-self-service";
export function getApplication(token:string,type:"jobs"|"internships",id:string):Promise<BackendResult<{status:"success";data:StudentApplication}>>{return backendJson(`/student/applications/${type}/${encodeURIComponent(id)}`,{accessToken:token,method:"GET"})}
