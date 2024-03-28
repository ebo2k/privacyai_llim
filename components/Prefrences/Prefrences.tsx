

function Prefrences() {


    const Domains = [
        {"domain":"transparency"},
        {"domain":"Fairness"},
        {"domain":"purpose"},
        {"domain":"Rights"}
    ];


  return (
    <div>
        <h1>prefrences123</h1>
        <div className='input-group'>
            {Domains?.map( ({ domain }: { domain: string })=> (
                <div className="flex items-center justify-between mb-5">
                    <p className="text-lg hover:text-white font-semibold">Name: {domain}</p>           
                </div>
                
            ))}
        </div>
     
    </div>
  )
}

export default Prefrences;