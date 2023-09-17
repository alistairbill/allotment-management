import { useEffect, useState } from 'preact/hooks'
import baptist from './mapdata';
import { ref, onValue, update } from 'firebase/database';
import { database } from './firebase';

type Plots = Record<string, { owner: string, notes: string }>;

export default function Map() {
  const [plots, setPlots] = useState<Plots>({});
  const [selectedId, setSelectedId] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [owner, setOwner] = useState("");
  const [notes, setNotes] = useState("");

  const setSelectedPlot = (id: string, name: string) => {
    setSelectedId(id);
    setSelectedName(name);
    setOwner(id in plots && "owner" in plots[id] ? plots[id].owner : "");
    setNotes(id in plots && "notes" in plots[id] ? plots[id].notes : "");
  }

  useEffect(() => onValue(ref(database, "plots"), (snapshot) => {
    if (snapshot.exists()) {
      setPlots(snapshot.val());
    }
  }), []);

  const updateOwner = () => update(ref(database), { [`plots/${selectedId}/owner`]: owner });
  const updateNotes = () => update(ref(database), { [`plots/${selectedId}/notes`]: notes });

  return (
    <div class="grid grid-cols-1 xl:grid-cols-3 bg-white dark:bg-black">
      {selectedId === "" ? null :
        <div class="p-6">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Plot {selectedName}</h5>
          <div className="mb-4">
            <label for="owner" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Plot holder</label>
            <input id="owner" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={owner} onChange={(e) => setOwner(e.currentTarget.value)} onBlur={updateOwner} />
          </div>
          <div className="mb-4">
            <label for="notes" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Notes</label>
            <textarea id="notes" rows={4} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Notes"
              value={notes} onChange={(e) => setNotes(e.currentTarget.value)} onBlur={updateNotes} />
          </div>
        </div>}
      <div className="col-span-2 p-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 720">
          {baptist.map((location) => {
            return (<g key={location.id}>
              <path
                className={location.id === selectedId ? "stroke-white dark:stroke-black stroke-2 fill-blue-500 hover:fill-blue-700" : "stroke-white dark:stroke-black stroke-2 fill-gray-400 hover:fill-gray-500"}
                cursor="pointer"
                name={location.name}
                d={location.path}
                onClick={() => setSelectedPlot(location.id, location.name)} />
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
