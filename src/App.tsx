import { useEffect, useState } from 'react'
import Menu from './layouts/Menu'
import { Input } from '@nextui-org/react'
import ReactPlayer from 'react-player';
import { saveAs } from 'file-saver';
import { toast, Toaster } from 'sonner';
// import { GoogleGenerativeAI } from "@google/generative-ai";

type mediatype = {
  itag:number, 
  url:string, 
  mimetype:string,
  codecs:string, 
  quality:string, 
  width:number,
  height:number,
  qualityLabel:string
}
type mediaInfo = {
  title:string
  description:string, 
  channelTitle:string,
  durationSeconds:string,
  regionAllowed:string[],
  viewCount:number

}



//import YOUTUBE_DATA_KEY from env file  using vite
import './App.css'

// Import YOUTUBE_DATA_KEY from env file using vite
const api_key = import.meta.env.VITE_YOUTUBE_DATA_KEY;
const api_url = import.meta.env.VITE_API_URL;



// ...





import './App.css'

function App() {

   const [search, setsearch] = useState({ maxResults: 10,
    key: ""})
    const [results, setresults] = useState<{items:object[]}>({items:[]})
    const [medialink, setmedialink] = useState("")
    const [mediaprepare, setmediaprepare] = useState<{info:mediaInfo, options:mediatype[]}|null>(null)
    const handleSearch = ()=>{
      if(search.key.length==0) return
      console.log(search.key.length)
       console.log(api_key)
       toast.promise(
        ()=>{
          return new Promise((resolve, reject:(err:unknown)=>void) => {
           const donnees = fetch('https://www.googleapis.com/youtube/v3/search?key='+api_key+'&q='+search.key)
      .then(res => res.json())
      .then(data => {setresults(data)
       return data
      })
      .catch(err => reject(err));
      resolve(donnees) 

          });
        }
      , {
        loading: 'Loading...',
        success: () => {
          return `recherches termine`;
        },
        error: 'Error',
      });
      // fetch('https://www.googleapis.com/youtube/v3/search?key='+api_key+'&q='+search.key)
      // .then(res => res.json())
      // .then(data => {setresults(data)})
      // .catch(err => console.log(err))
    }
    useEffect(() => {
       
     if(medialink.length==0) return
    console.log(medialink)
    toast.promise(
      ()=>{
        return new Promise((resolve, reject) => {
          const donnees = fetch(api_url+"?videourl="+medialink)
          .then(res => res.json())
          .then(data => {
            console.log(data)
             setmediaprepare(data)
             return data
          })
          .catch(err => reject(err));
          resolve(donnees)

        });
      }
    , {
      loading: 'Loading...',
      success: (data:mediatype) => {
        console.log(mediaprepare)
        window.location.hash = ("#mediadownload")
        return `chargement de la video termine`;
      },
      error: 'Error',
    });
    
      // console.log(link)
      // setlink("")
    }, [medialink])

    const handledownload = (video:mediatype)=>{
      console.log(video)
      toast.promise(
        ()=>{
          return new Promise((resolve, reject) => {
            try{
              saveAs(video.url, mediaprepare?.info.title+".mp4");
            }
            catch(err){
              reject(err)
            }
            // const donnees = fetch(video.url)
            // .then(res => res.blob())
            // .then(data => {
            //   console.log(data)
            //   const randomName = mediaprepare?.info?.title
            //   saveAs(api_url+"/api/downloads/"+data.file, randomName+".mp4");
            //   // return data     
            // })
            // .catch(err => reject(err));
            resolve(true)

          });
        }
      , {
        loading: 'Loading...',
        success: (data:string[]) => {
          return `${data.length} a ete telecharger`;
        },
        error: 'Error',
      });
    
          // fetch(api_url+"/api/download?videourl="+mediaprepare?.videourl+"&itag="+video.itag)
          // .then(res => res.json())
          // .then(data => {
          //   console.log(data)
          //   saveAs(api_url+"/api/downloads/"+data.file, mediaprepare?.title+".mp4");
          // })
          // .catch(err => console.log(err))
    }

  return (
    <>
    <Toaster></Toaster>
    <Menu></Menu>
      <div className="grid gap-2 grid-cols-2">
        <div className="p-5 text-white font-bold vara-container" id='vara-container'>

        </div>
      </div>
      {/* <SmartTab tabs={tabs}></SmartTab> */}
      <div className="pt-5 pb-3 px-5">
        <div className="pt-2 p-3 border text-3xl">
          
        </div>
        <div className="border border-white p-3 rounded bg-transparent">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
      <Input
            
            onInput={(e:any) => setsearch({ ...search, key: (e.target as HTMLInputElement).value })}
            color="secondary"
            
            label="chercher une video"
           />
           <Input
            
            onInput={(e:any) => setmedialink(e.target.value)}
            color="secondary"
            
            label="coller une url youtube"
           />
      </div>
          
           <button className="rounded p-2 border text-white font-bold mt-2" onClick={handleSearch}>Rechercher</button>

        </div>
        <div className="pt-2 pb-2 grid lg:grid-cols-2 grid-cols-1 gap-2 px-3 ">
          <div className='max-w-5xl overflow-hidden  pt-0'>

            {results.items.map((item:any) => (
              <div key={item.id.videoId}>
              <ReactPlayer url={"https://www.youtube.com/watch?v="+item.id.videoId} width={"100%"} />
              <div>
                <div className="text-white font-bold p-2 mt-2 border border-white rounded cursor-pointer" onClick={()=>setmedialink("https://www.youtube.com/watch?v="+item.id.videoId)}>charger la video</div>
              </div>
            </div>
            ))}
              
          </div>

          <section className="py-6 sm:py-12  text-white">
	<div className="container p-6 mx-auto space-y-8">
		<div className="space-y-2 text-center">
			<h2 className="text-3xl font-bold">{mediaprepare?.info.title}</h2>
			{/* <p className="font-serif text-sm text-white">{mediaprepare?.width}x{mediaprepare?.height}</p> */}
		</div>
		<div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-2" id='mediadownload'>
			
			{mediaprepare?.options?.map((media:mediatype)=>(
        <article className="flex flex-col dark:bg-gray-900">
				{/* <a rel="noopener noreferrer" href="#" aria-label="Te nulla oportere reprimique his dolorum">
					<img alt="" className="object-cover w-full h-52 dark:bg-gray-500" src={mediaprepare?.thumbnail} />
				</a> */}
				<div className="flex flex-col flex-1 p-6">
					<a rel="noopener noreferrer" href="#" aria-label="Te nulla oportere reprimique his dolorum"></a>
					<a rel="noopener noreferrer" href="#" className="text-xs tracki uppercase hover:underline dark:text-violet-400">{media.width} x {media.height}</a>
          <a rel="noopener noreferrer" href="#" className="text-xs tracki uppercase hover:underline dark:text-violet-400">{media.qualityLabel} </a>
					<h3 className="flex-1 py-2 text-lg font-semibold leadi">{mediaprepare.info.title}</h3>
					<div className="flex flex-wrap justify-between pt-3 space-x-2 text-xs dark:text-gray-400">
						<button className="rounded border p-2 font-bold" onClick={()=>handledownload(media)}>telecharger</button>
						
					</div>
				</div>
			</article>
      ))}
			
		</div>
	</div>
</section>
        

        </div>
      </div>
    </>
  )
}

export default App
