import { useEffect, useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import MDEditor from "@uiw/react-md-editor";
import logoPath from "../../assets/icons/128.png";
import { IterationSummary } from "../../models/adoSummary";
import { markdownTable } from 'markdown-table'
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import { GenerateIterationSummaryAction } from "../../models/actions";

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
                Summary
              </h1>
            </div>
          </header>
        </div>
        <main className="-mt-32">
          <div className="mx-auto px-4 pb-12">
            <div className="mx-auto max-w-7xl" data-color-mode="light">
              <MDEditor
                height={750}
                value={value}
                onChange={(val) => val && setValue(val)}
                preview='preview'
                previewOptions={{
                    linkTarget: '_blank'
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default App;
