"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Head from "next/head"

export default function Home() {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [showScene, setShowScene] = useState(false)
  const [showSparks, setShowSparks] = useState(false)
  const [imageIndex, setImageIndex] = useState(0) // Controls background image
  const [daysSinceMet, setDaysSinceMet] = useState(0)

  // Image sequence: next-background → pic2 → pic3 → pic4 → next-background (then redirect)
  const backgroundImages = [
    "/next-background.png",
    "/pic2.png",
    "/pic3.png",
    "/pic4.png",
    "/next-background.png",
  ]

  useEffect(() => {
    const firstMetDate = new Date(2024, 11, 21) // Months are zero-indexed
    const today = new Date()
    const timeDifference = today.getTime() - firstMetDate.getTime()
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    setDaysSinceMet(daysDifference)
  }, [])

  useEffect(() => {
    if (imageIndex > 0 && imageIndex < backgroundImages.length) {
      const timeouts = [3000, 3000, 4000, 3000] // Time delays for each image

      const timer = setTimeout(() => {
        setImageIndex((prev) => prev + 1)
      }, timeouts[imageIndex - 1])

      return () => clearTimeout(timer)
    }

    
  }, [imageIndex, router])

  const playAudio = () => {
    const audio = document.getElementById("recordPlayerAudio") as HTMLAudioElement | null
    if (audio && !isPlaying) {
      audio.play()
      setIsPlaying(true)
      setTimeout(() => setShowScene(true), 2000) // Show scene after 2 seconds
      setTimeout(() => setImageIndex(1), 14000) // Start image transition after 14s
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#090909] text-center overflow-hidden">
      <Head>
        <title>Happy Valentine&apos;s Day! ❤️</title>
      </Head>

      {imageIndex === 0 ? (
        <>
          {showScene && (
            <motion.div
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: "url('/street-scene.jpg')" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
            />
          )}
          <motion.h1
            className="text-5xl font-bold text-red-500 relative mt-[-40px]"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: -20 }}
            transition={{ duration: 1 }}
          >
            Happy Valentine&apos;s Day, Love! ❤️
          </motion.h1>
          <motion.p
            className="mt-2 text-lg text-gray-300 relative"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: -10 }}
            transition={{ delay: 1, duration: 1 }}
          >
            We have been together for {daysSinceMet} days! 💖
          </motion.p>
          <motion.div
            className="cursor-pointer relative"
            onClick={playAudio}
            animate={isPlaying ? { y: -400, rotate: 360 } : { y: 0, rotate: 0 }}
            transition={isPlaying ? { duration: 2, ease: "easeInOut" } : { duration: 0 }}
          >
            <motion.img
              src="/record-player.png"
              alt="Record Player"
              className="w-60 h-60 rounded-lg"
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={
                isPlaying ? { repeat: 1, duration: 5, ease: "linear" } : { duration: 0 }
              }
            />
          </motion.div>
          {showScene && (
            <>
              <motion.img
                src="/double-decker-bus.png"
                alt="Double Decker Bus"
                className="absolute bottom-10 w-40 h-20"
                initial={{ x: -500 }}
                animate={{ x: "80vw" }}
                transition={{ duration: 15, ease: "easeInOut" }}
                onAnimationComplete={() => setShowSparks(true)}
              />
              <motion.img
                src="/road-object.png"
                alt="Road Object"
                className="absolute bottom-10 right-10 w-40 h-40"
              />
              {showSparks && (
                <motion.div
                  className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-400 rounded-full opacity-70"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 4.5, opacity: 0.5 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </>
          )}
        </>
      ) : (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            backgroundImage: `url('${backgroundImages[imageIndex - 1]}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      <audio id="recordPlayerAudio" src="/there-is-a-light.mp3" loop></audio>
    </div>
  )
}
