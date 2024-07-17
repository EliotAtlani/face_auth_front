import { motion } from "framer-motion";
import LogoutButton from "../components/buttons/LogOutBtn";
import { LampContainer } from "../components/ui/lamp";

const Home = () => {
  return (
    <LampContainer>
      <motion.div
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className=" items-center flex flex-col  gap-8 mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        Congratulations
        <br />
        <span className="text-2xl md:text-4xl text-primary/[0.8]">
          You are logged in!
        </span>
        <LogoutButton />
      </motion.div>
    </LampContainer>
  );
};

export default Home;
