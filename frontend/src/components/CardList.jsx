import React, { useEffect, useState } from 'react'
import CardImg from '../assets/cardimg.jpg'
import { Link } from 'react-router'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
const CardList = ({title, category}) => {
    const [data,setData] = useState([]);
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOTdlMWQ1YzhiZTlhMjJhMmRkYTAwN2Q2ZjU3YjNhYiIsIm5iZiI6MTc1NjIyMzAyMS45NSwic3ViIjoiNjhhZGQ2MmRmNzE3ZTQ2NGUyNzgyNmUyIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.IZtGLOvxjYOcR7M3yG-jImp4i943NerMq2bMtO-V0h0'
        }
    };
    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`, options)
        .then(res => res.json())
        .then(res => setData(res.results))
        .catch(err => console.error(err));
    },[]);
    return (
        <div className='text-white md:px-4'>
            <h2 className='pt-10 pb-5 text-lg font-medium'>{title}</h2>

            <Swiper slidesPerView={"auto"} spaceBetween={16} className='mySwiper'>
                {data.map((item, index) => (
                    <SwiperSlide key={index} className='max-w-[220px]'>
                        <Link to={`movie/${item.id}`}>
                            <div className="relative group rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200 bg-[#232323]">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                                    alt={item.original_title}
                                    className="h-[330px] w-full object-cover object-center group-hover:opacity-80 transition"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                                    <p className="text-base font-semibold text-white truncate">{item.title || item.original_title}</p>
                                    <span className="text-xs text-gray-300">{item.release_date?.slice(0, 4)}</span>
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default CardList