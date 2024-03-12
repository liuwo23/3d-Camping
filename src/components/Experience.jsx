import { CameraControls, Text, Environment, MeshReflectorMaterial, RenderTexture, Float, useFont } from "@react-three/drei";
import { degToRad, lerp } from "three/src/math/MathUtils";
import { Camping } from "./Camping";
import { useRef, useEffect } from "react";
import { Color } from "three";
import { useAtom } from "jotai";
import { currentPageAtom } from "./UI";
import { useFrame } from "@react-three/fiber";

const bloomColor = new Color("#fff");
bloomColor.multiplyScalar(1.5);


export const Experience = () => {
  const controls = useRef();
  
  const meshFitCameraHome = useRef();
  const meshFitCameraStore = useRef();
  const textMaterial = useRef();
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom)
  const intro = async () => {
    controls.current.dolly(-22);
    controls.current.smoothTime = 1.6;
    // controls.current.dolly(22, true);
    setTimeout(() => {
      setCurrentPage("home");
    }, 1200);
    fitCamera();
  }

  useFrame((_, delta) => {
    textMaterial.current.opacity = lerp(
      textMaterial.current.opacity,
      currentPage === "home" || currentPage === "intro" ? 1 : 0,
      delta * 1.5
    );
  });

  const fitCamera = async () => {
    if(currentPage === "store"){
      controls.current.smoothTime = 0.8;

      controls.current.fitToBox(meshFitCameraStore.current, true);
    } else{
      controls.current.smoothTime = 1.6;
      controls.current.fitToBox(meshFitCameraHome.current, true);
    }
  }

  useEffect(() => {
    intro();
  }, []);

  useEffect(() => {
    fitCamera();
    window.addEventListener("resize", fitCamera);
    return () => window.removeEventListener("resize", fitCamera);

  },[currentPage]);

  return (
    <>
      <CameraControls ref={controls} />
      <mesh ref={meshFitCameraHome} position-z={1.5} visible={false}>
        <boxGeometry args={[7.5, 2, 2]} />
        <meshBasicMaterial color="orange" transparent opacity="0.5"></meshBasicMaterial>
      </mesh>
      <Text font="fonts/Poppins-Black.ttf"
        position-x={-1.3}
        position-y={-0.5}
        position-z={1}
        lineHeight={0.8}
        textAlign={"center"}
        rotation-y={degToRad(30)}
        anchorY={"bottom"}>
        MY LITTLE {"\n"}CAMPING
        <meshBasicMaterial color={bloomColor} toneMapped={false} ref={textMaterial}>
          <RenderTexture attach="map">
            <color attach="background" args={["#fff"]} />
            <Environment files={"img/venice_sunset_1k.hdr"} />
            <Float floatIntensity={4} rotationInensity={5}>
              <Camping
                scale={1.6}
                rotation-y={-degToRad(25)}
                rotation-x={degToRad(40)}
                position-y={-0.5}
              />
            </Float>
          </RenderTexture>
        </meshBasicMaterial>
      </Text>
      <group rotation-y={degToRad(-25)} position-x={3}>
        <Camping scale={0.6} html></Camping>
        <mesh ref={meshFitCameraStore} visible={false}>
          <boxGeometry args={[2,1,2]}></boxGeometry>
          <meshBasicMaterial color="red" transparent opacity={0.5}></meshBasicMaterial>
        </mesh>
      </group>
      <mesh position-y={-0.48} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[100, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={10}
          roughness={1}
          depthScale={1}
          opacity={0.5}
          transparent
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#333"
          metalness={0.5}
        />
      </mesh>
      <Environment files={"img/venice_sunset_1k.hdr"} />
    </>
  );
};

useFont.preload("fonts/Poppins-Black.ttf")