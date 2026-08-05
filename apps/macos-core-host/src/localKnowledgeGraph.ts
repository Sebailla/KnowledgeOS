import { LocalKnowledgeGraph } from "@knowledgeos/knowledge-graph";
export const localKnowledgeGraph = new LocalKnowledgeGraph();
localKnowledgeGraph.rebuild([
 {id:"publication:knowledge-os",type:"document",label:"KnowledgeOS Architecture",properties:{resourceId:"publication:knowledge-os"}},
 {id:"publication:offline-first",type:"book",label:"Offline First Systems",properties:{resourceId:"publication:offline-first"}},
 {id:"publication:knowledge-graphs",type:"paper",label:"Personal Knowledge Graphs",properties:{resourceId:"publication:knowledge-graphs"}},
 {id:"concept:offline-first",type:"concept",label:"Offline First",properties:{}},
 {id:"concept:knowledge-graph",type:"concept",label:"Knowledge Graph",properties:{}},
 {id:"tag:sync",type:"tag",label:"Synchronization",properties:{}},
], [
 {id:"edge:1",type:"mentions",sourceId:"publication:knowledge-os",targetId:"concept:offline-first",directed:true,properties:{}},
 {id:"edge:2",type:"relatedTo",sourceId:"publication:knowledge-os",targetId:"concept:knowledge-graph",directed:true,properties:{}},
 {id:"edge:3",type:"taggedWith",sourceId:"publication:offline-first",targetId:"tag:sync",directed:true,properties:{}},
 {id:"edge:4",type:"mentions",sourceId:"publication:knowledge-graphs",targetId:"concept:knowledge-graph",directed:true,properties:{}},
]);
