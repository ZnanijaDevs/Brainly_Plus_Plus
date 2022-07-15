import { 
  useContext, 
  createContext,
  Dispatch,
  SetStateAction
} from "react";

import type { CommonDataInTicketType } from "@typings/";

const TicketNodeContext = createContext<{
  node: CommonDataInTicketType;
  updateNode: Dispatch<SetStateAction<CommonDataInTicketType>>;
    }>(null);

const useTicketNode = () => {
  const { 
    node, 
    updateNode,
  } = useContext(TicketNodeContext);

  return { 
    node,
    updateNode: (
      updatedData: Partial<CommonDataInTicketType>
    ) => updateNode(prevState => (
      { ...prevState, ...updatedData }
    ))
  };
};

export {
  TicketNodeContext,
  useTicketNode
};