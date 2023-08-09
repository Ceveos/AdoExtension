import { useEffect, useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import logoPath from "../../assets/icons/128.png";
import { IterationSummary } from "../../models/adoSummary";
import { useSearchParams } from "react-router-dom";
import { GenerateCompletedSummaryAction, GenerateIterationSummaryAction } from "../../models/actions";
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

export const ChevronRight: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path
      fillRule="evenodd"
      d="M10 15.5a.5.5 0 01-.354-.854l4.096-4.096-4.096-4.096a.5.5 0 11.707-.707l4.5 4.5a.5.5 0 010 .707l-4.5 4.5A.498.498 0 0110 15.5z"
      clipRule="evenodd"
    />
  </svg>
);

const App = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [dateRange, setDateRange] = useState<{from: string, to: string}>()
  const [value, setValue] = useState<TreeObj[]>([...data]);
  const [loaded, setLoaded] = useState<boolean>()
  const [generateRequestSent, setGenerateRequestSent] = useState<boolean>()


  const onMessage = async (
    request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    if (!request.completedSummary) {
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
    let from = searchParams.get('from')
    let to = searchParams.get('to')
    if (!from || !to) {
      if (value.length > 0) {
        setValue([]);
      }
      return;
    }
    if (!dateRange || dateRange.from !== from || dateRange.to !== to) {
      setDateRange({from, to});
      setGenerateRequestSent(false)
    }
  }, [value, dateRange, searchParams]);

  useEffect(() => {
    if (!dateRange || dateRange === null || generateRequestSent) {
      return;
    }

    setGenerateRequestSent(true);

    const action: GenerateCompletedSummaryAction = {
      action: 'GenerateCompletedSummary',
      from: dateRange.from,
      to: dateRange.to
    }
    chrome.runtime.sendMessage(action, (resp) => { });
  }, [dateRange, generateRequestSent]);


  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

  function Node<T extends TreeObj>(props: NodeRendererProps<T>) {
    /* This node instance can do many things. See the API reference. */
    return (
      <div
        className="hover:bg-sky-100 h-full text-xl space-x-2"
        style={props.style}
        ref={props.dragHandle}
        onClick={() => props.node.toggle()}
      >
        {!props.node.isLeaf && (
          <ChevronRight 
            className={classNames("inline w-6 h-6", props.node.isOpen ? "rotate-90" : "")} />
        )}
        <span>{props.node.isLeaf ? "🍁" : "🗀"}</span>

        <span>{props.node.data.name}</span>
        <span className="ml-auto">5/6 Completed</span>
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
                initialData={value}
                disableDrag
                disableEdit
                disableDrop
                width={800}
                rowHeight={30}
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
