import { useEffect, useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import logoPath from "../../assets/icons/128.png";
import { IterationSummary } from "../../models/adoSummary";
import { useSearchParams } from "react-router-dom";
import { GenerateIterationSummaryAction } from "../../models/actions";
import { Tree, NodeRendererProps } from "react-arborist";
import { IdObj } from "react-arborist/dist/types/utils";

export interface ITreeObj extends IdObj {
  name: string;
  type: "node" | "leaf"
  itemType: "epic" | "scenario" | "deliverable" | "task" | "bug";
  children?: ITreeObj[]
}

export type TreeObj = ITreeObj

const data: TreeObj[] = [
  {
    id: "s1",
    name: "Test Scenario 1",
    itemType: 'scenario',
    type: 'node',
    children: [
      {
        id: "d1",
        name: "Test Deliverable 1",
        itemType: 'scenario',
        type: 'node',
        children: [
          {
            id: "t1",
            name: "Test Task 1",
            itemType: 'task',
            type: 'leaf'
          },
          {
            id: "t2",
            name: "Test Task 2",
            itemType: 'task',
            type: 'leaf'
          }
        ]
      }
    ],
  },
];

const App = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [iterationId, setIterationId] = useState<string>()
  const [value, setValue] = useState("**No iteration specified; Waiting...**");
  const [loaded, setLoaded] = useState<boolean>()
  const [generateRequestSent, setGenerateRequestSent] = useState<boolean>()


  const onMessage = async (
    request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    if (!request.summary) {
      return;
    }
    console.log("Got summary");
    console.log(request);
    const summary = request.summary as IterationSummary;

   
  };

  useEffect(() => {
    if (loaded) {
      return;
    }

    chrome.runtime.onMessage.addListener(onMessage);
    setLoaded(true);
  }, [loaded]);

  useEffect(() => {
    let newIterationId = searchParams.get('iteration')
    if (iterationId !== newIterationId) {
      setIterationId(newIterationId ?? undefined);
      setGenerateRequestSent(false)
    }
  }, [iterationId, searchParams]);

  useEffect(() => {
    if (!iterationId || iterationId === null || generateRequestSent) {
      return;
    }

    setGenerateRequestSent(true);

    const action: GenerateIterationSummaryAction = {
      action: 'GenerateIterationSummary',
      iterationId: iterationId
    }
    chrome.runtime.sendMessage(action, (resp) => {});
  }, [iterationId, generateRequestSent]);


  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

  function  Node<T extends TreeObj>(props: NodeRendererProps<T>) {
    
    const {isFocused, isSelected} = props.node;

    /* This node instance can do many things. See the API reference. */
    return (
      <div 
        className={
          classNames(
            isFocused ? "bg-cyan-100" : "",
            isSelected ? "bg-cyan-200" : "",
            "hover:bg-cyan-100 h-full text-lg"
          )
        }
        style={props.style} ref={props.dragHandle} onClick={() => props.node.toggle()}
      >
        {props.node.isLeaf ? "🍁" : "🗀"}
        {props.node.data.name}
      </div>
    );
  }

  return (
    <>
      <div className="min-h-full">
        <div className="bg-gray-800 pb-32">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="border-b border-gray-700">
              <div className="flex h-16 items-center justify-between px-4 sm:px-0">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-8 w-8"
                      src={chrome.runtime.getURL(logoPath)}
                      alt="Your Company"
                    />
                  </div>
                  <div className="block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      <h1 className="text-xl font-bold tracking-tight text-white">
                        ADO Power Tools
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    <button
                      type="button"
                      className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <header className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Completed Summary
              </h1>
            </div>
          </header>
        </div>
        <main className="-mt-32">
          <div className="mx-auto px-4 pb-12">
            <div className="mx-auto max-w-7xl bg-white border-gray-200 sm:px-6 lg:px-8">
              <Tree
                initialData={data as any}
                disableDrag
                disableEdit
                disableDrop
                openByDefault={false}
              >{Node}</Tree>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default App;
