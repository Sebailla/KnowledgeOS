import { createHmac, timingSafeEqual, randomUUID } from "node:crypto";
export interface AccessClaims { readonly sub:string; readonly deviceId:string; readonly scopes:readonly string[]; readonly iat:number; readonly exp:number; }
function encode(value:unknown):string{return Buffer.from(JSON.stringify(value)).toString("base64url");}
function sign(input:string,secret:string):string{return createHmac("sha256",secret).update(input).digest("base64url");}
export class PersonalKnowledgeTokenService {
  public constructor(private readonly secret:string,private readonly accessSeconds:number=900){}
  issue(ownerId:string,deviceId:string,scopes:readonly string[],nowSeconds:number):string{const h=encode({alg:"HS256",typ:"JWT"});const p=encode({sub:ownerId,deviceId,scopes,iat:nowSeconds,exp:nowSeconds+this.accessSeconds});return `${h}.${p}.${sign(`${h}.${p}`,this.secret)}`;}
  verify(token:string,nowSeconds:number):AccessClaims{const parts=token.split(".");if(parts.length!==3)throw new Error("Invalid token");const [h,p,s]=parts as [string,string,string];const expected=sign(`${h}.${p}`,this.secret);if(!timingSafeEqual(Buffer.from(s),Buffer.from(expected)))throw new Error("Invalid signature");const claims=JSON.parse(Buffer.from(p,"base64url").toString("utf8")) as AccessClaims;if(claims.exp<=nowSeconds)throw new Error("Token expired");return claims;}
  newRefreshTokenId():string{return randomUUID();}
}
export function authorize(claims:AccessClaims,ownerId:string,deviceId:string,scope:string):void{if(claims.sub!==ownerId)throw new Error("Owner mismatch");if(claims.deviceId!==deviceId)throw new Error("Device mismatch");if(!claims.scopes.includes(scope))throw new Error("Missing scope");}
