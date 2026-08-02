import type { SearchCancellationSignal } from "./contracts.js";
export class SearchCancellationToken implements SearchCancellationSignal {
  private value=false;
  get cancelled(){ return this.value; }
  cancel(){ this.value=true; }
  throwIfCancelled(){ if(this.value) throw new Error("Search cancelled"); }
}
