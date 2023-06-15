"use client";

import { useEffect, useState } from "react";
import { CarCard, CustomFilter, Hero, SearchBar } from "@/components";
import Image from "next/image";
import { fetchCars } from "@/utils";
import { fuels, yearsOfProduction } from "@/constants";
import { HomeProps } from "@/types";
import ShowMore from "@/components/ShowMore";

// export default async function Home({ searchParams }: HomeProps) {

//   const allCars = await fetchCars({
//     manufacturer: searchParams.manufacturer || "",
//     year: searchParams.year || 2023,
//     fuel: searchParams.fuel || "",
//     limit: searchParams.limit || 10,
//     model: searchParams.model || "",
//   });

//client side render for the auto scroll bug in next 13
export default function Home() {
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(false);

  //search states

  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");

  //filter states
  const [fuel, setFuel] = useState("");
  const [year, setYear] = useState(2022);

  //pagination states
  const [limit, setLimit] = useState(10);

  const getCars = async () => {
    setLoading(true);
    try {
      const result = await fetchCars({
        manufacturer: manufacturer || "",
        year: year || 2023,
        fuel: fuel || "",
        limit: limit || 10,
        model: model || "",
      });

      setAllCars(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCars();
    console.log(fuel, limit, manufacturer, model);
  }, [fuel, year, limit, manufacturer, model]);

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;
  console.log("dataempty", isDataEmpty, allCars);

  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore the cars you might like</p>
        </div>

        <div className="home__filters">
          {/* <SearchBar /> */}
          <SearchBar setManufacturer={setManufacturer} setModel={setModel} />

          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} setFilter={setFuel} />
            <CustomFilter
              title="year"
              options={yearsOfProduction}
              setFilter={setYear}
            />
          </div>
        </div>

        {/* {!isDataEmpty ? ( */}
        {allCars.length > 0 ? (
          <section>
            <div className="home__cars-wrapper">
              {allCars?.map((car) => (
                <CarCard car={car} />
              ))}
            </div>

            {loading && (
              <div>
                <Image
                  src="/loader.svg"
                  alt="loader"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>
            )}

            <ShowMore
              // pageNumber={(searchParams.limit || 10) / 10}
              // isNext={(searchParams.limit || 10) > allCars.length}\

              //client side rendering (using states)
              pageNumber={limit / 10}
              isNext={limit > allCars.length}
              setLimit={setLimit}
            />
          </section>
        ) : (
          <div className="home__error-container">
            <h2 className="text-black text-xl font-bold">Oops, no results</h2>
            <p>{allCars?.message}</p>
          </div>
        )}
      </div>
    </main>
  );
}
