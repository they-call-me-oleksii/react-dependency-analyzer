type VScodeAPI = {
  getState: () => undefined;
  setState: (state: Record<string, any>) => void;
  pushMessage: (message: string) => void;
};

//@ts-ignore
const vscodeAPI: VScodeAPI = acquireVsCodeApi();
console.log("IN INIT ");

vscodeAPI.setState({ type: "INIT" });
console.log(vscodeAPI.getState(), { vscodeAPI });
