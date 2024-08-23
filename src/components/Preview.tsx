interface PreviewProps {
    // ... props for form data and handlers
    heading: string,
    setStep: any,
    tokenAddress : string,
    rangeStart: number,
    rangeEnd: number,
    handleSubmit: any,
    step: any,
    balance: any,
    setBalance: any,
    decimal: any,
    reward: any
    
  }
const Preview = (props: PreviewProps)=> {
    
    return (
        <>
        
            <div className="bg-white p-8 rounded-lg shadow-md">
              <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={() => {
                  props.setStep(props.step - 1)
              }}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="rgba(0,0,0,1)" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>

              </button>

              
              <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => {
                        props.setStep(props.step + 1); // or whatever step is the next one
                    }}
                >

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="rgba(0,0,0,1)" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>

                    
              </button>

              <h2 className="text-2xl font-bold mb-4 text-black">{props.heading}</h2>

              {props.step == 4 && 
                <h2 className="text-xl mb-4 text-black"> Rewards earned = {props.reward.toFixed(3)}</h2>
              }
    
              <button
              type="submit"
              className={`bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-full`}
              onClick={props.handleSubmit}
              >
                  Start tx
              </button>
            </div>
        </>
  );
};

export default Preview;