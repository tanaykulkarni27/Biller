function Loader() {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="h-12 w-12 rounded-full border-4 border-[#7367f0] border-t-transparent animate-spin" />
    </div>
  )
}

export default Loader;