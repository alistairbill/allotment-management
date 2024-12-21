import { useEffect, useState } from 'preact/hooks'
import baptist, { plotNames, PlotId, isPlotId } from './mapdata';
import { ref, onValue, update } from 'firebase/database';
import { database } from './firebase';
import { JSX } from 'preact';

type HolderInfo = Record<PlotId, {
  owner: string,
  associates: string,
  startDate: string,
  notes: string,
  url: string,
}>;

export default function Map() {
  const [holderInfo, setHolderInfo] = useState({} as HolderInfo);
  const [selectedId, setSelectedId] = useState<PlotId | null>(null);
  const [owner, setOwner] = useState("");
  const [associates, setAssociates] = useState("");
  const [startDate, setStartDate] = useState("");
  const [notes, setNotes] = useState("");
  const [url, setUrl] = useState("");

  const handleClick = ({ currentTarget }: JSX.TargetedEvent<SVGPathElement, Event>) => {
    const id = currentTarget.id;
    if (isPlotId(id)) {
      setSelectedId(id);
      setOwner(id in holderInfo && "owner" in holderInfo[id] ? holderInfo[id].owner : "");
      setAssociates(id in holderInfo && "associates" in holderInfo[id] ? holderInfo[id].associates : "");
      setStartDate(id in holderInfo && "startDate" in holderInfo[id] ? holderInfo[id].startDate : "");
      setNotes(id in holderInfo && "notes" in holderInfo[id] ? holderInfo[id].notes : "");
      setUrl(id in holderInfo && "url" in holderInfo[id] ? holderInfo[id].url : "");
    }
  }

  useEffect(() => onValue(ref(database, "plots"), (snapshot) => {
    if (snapshot.exists()) {
      setHolderInfo(snapshot.val());
    }
  }), []);

  const handleChangeOwner = ({ currentTarget }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    setOwner(currentTarget.value);
  };
  const handleChangeAssociates = ({ currentTarget }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    setAssociates(currentTarget.value);
  };
  const handleChangeStartDate = ({ currentTarget }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    setStartDate(currentTarget.value);
  };
  const handleChangeNotes = ({ currentTarget }: JSX.TargetedEvent<HTMLTextAreaElement, Event>) => {
    setNotes(currentTarget.value);
  };
  const handleChangeUrl = ({ currentTarget }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    setUrl(currentTarget.value);
  };

  const commitOwner = () => update(ref(database), { [`plots/${selectedId}/owner`]: owner });
  const commitAssociates = () => update(ref(database), { [`plots/${selectedId}/associates`]: associates });
  const commitStartDate = () => update(ref(database), { [`plots/${selectedId}/startDate`]: startDate });
  const commitNotes = () => update(ref(database), { [`plots/${selectedId}/notes`]: notes });
  const commitUrl = () => update(ref(database), { [`plots/${selectedId}/url`]: url });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 bg-white dark:bg-black">
      {selectedId === null ? null :
        <form className="p-6">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Plot {plotNames[selectedId]}</h5>
          <div className="mb-4">
            <label for="owner" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Plot holder</label>
            <input id="owner" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={owner} onChange={handleChangeOwner} onBlur={commitOwner} />
          </div>
          <div className="mb-4">
            <label for="startDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date started</label>
            <input id="startDate" type="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={startDate} onChange={handleChangeStartDate} onBlur={commitStartDate} />
          </div>
          <div className="mb-4">
            <label for="url" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Trello URL</label>
            <div className="flex items-center gap-2">
              <input id="url" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={url} onChange={handleChangeUrl} onBlur={commitUrl} />
              <a href={url} target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded whitespace-nowrap">
                Open
              </a>
            </div>
          </div>
          <div className="mb-4">
            <label for="associates" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Associates</label>
            <input id="associates" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={associates} onChange={handleChangeAssociates} onBlur={commitAssociates} />
          </div>
          <div className="mb-4">
            <label for="notes" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Notes</label>
            <textarea id="notes" rows={4} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Notes"
              value={notes} onChange={handleChangeNotes} onBlur={commitNotes} />
          </div>
        </form>}
      <div className="col-span-2 p-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 720">
          {baptist.map((location) => {
            return (<g key={location.id}>
              <path
                className={location.id === selectedId ? "stroke-white dark:stroke-black stroke-2 fill-blue-500 hover:fill-blue-700" : "stroke-white dark:stroke-black stroke-2 fill-gray-400 hover:fill-gray-500"}
                cursor="pointer"
                id={location.id}
                d={location.path}
                onClick={handleClick} />
              <text x={location.x} y={location.y} className="text-xl fill-white" pointer-events="none">{location.name}</text>
            </g>)
          })}
          <path className="stroke-gray-400 stroke-2 fill-none" d="m 495.5789,720.17624 1.55354,-14.20379 -9.0993,-6.87996 -18.8644,-2.66321 -83.00336,16.867 -57.48094,-7.32383" />
          <path className="stroke-gray-400 stroke-2 fill-none" d="m 511.11429,719.73237 -0.88774,-23.74695" />
          <path className="stroke-gray-400 stroke-2 fill-none" d="M 483.15059,37.506867 479.15578,30.404975 468.281,22.859215 447.86306,19.974071 377.73188,17.310862 338.00567,11.540575 187.9782,0.8877365" />
          <path className="stroke-gray-400 stroke-2 fill-none" d="m 488.69894,86.332375 10.43091,-47.050035 11.54057,3.329012 26.18823,-6.214155 58.81254,1.553538 28.85144,4.438683 55.2616,20.196005 80.11821,26.854029 L 952.0974,196.4117" />
        </svg>
      </div>
    </div>
  );
}
