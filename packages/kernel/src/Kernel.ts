import {EngineRegistry} from './registry/EngineRegistry.js';
import {KernelState} from './lifecycle/KernelState.js';
import {Engine} from './contracts/Engine.js';
export class Kernel{
 private registry=new EngineRegistry();
 private state=KernelState.Created;
 register(engine:Engine){this.registry.register(engine);}
 async initialize(){this.state=KernelState.Initializing; for(const e of this.registry.getAll()) await e.initialize();}
 async start(){for(const e of this.registry.getAll()) await e.start(); this.state=KernelState.Running;}
 async stop(){this.state=KernelState.Stopping; for(const e of [...this.registry.getAll()].reverse()){await e.stop(); await e.dispose();} this.state=KernelState.Disposed;}
}
