import { BarLoader } from "react-spinners";


export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <BarLoader color="#2A254B" />
    </div>
  );
}
