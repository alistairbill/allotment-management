import { useState } from 'preact/hooks';

interface LoginProps {
    login: (email: string, password: string) => Promise<void>;
    error: string;
}

export default function Login(props: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = async (event: Event) => {
        event.preventDefault();
        await props.login(email, password);
    }

    return (
    <div className="grid h-screen place-items-center bg-white dark:bg-black">
      <div className="w-full max-w-sm p-4 border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h5 class="text-xl font-medium text-gray-900 dark:text-white">Log in</h5>
          <div>
            <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
            <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="Email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} required />
          </div>
          <div>
            <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
            <input
              type="password" name="password" id="password" placeholder="••••••••"
              className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white" ${props.error === "" ? "border-gray-300 dark:border-gray-500" : "border-red-500"}`}
              onChange={(e) => setPassword(e.currentTarget.value)} />
          </div>
          <button className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="submit">
            Log in
          </button>
        </form>
        <p className="text-red-500 text-xs italic">{props.error}</p>
      </div>
    </div>);
}
