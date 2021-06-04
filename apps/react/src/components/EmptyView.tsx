import React from 'react';
import { IonIcon } from "@ionic/react"
import { alertCircleOutline } from "ionicons/icons";
import styles from './EmptyView.module.css';

interface ContainerProps {
  title: string;
  text?: string;
  icon?: string;
};

const EmptyView: React.FC<ContainerProps> = ({ title, text, icon }) => {
  return (
    <div className="flex flex-col full-height align-items-center p-md ion-text-center justify-content-center">
      <IonIcon className={styles.icon} icon={icon || alertCircleOutline}></IonIcon>
      <h5 className={styles.title}>{title}</h5>
      <p className={styles.text}>{text}</p>
    </div>
  );
};

export default EmptyView;
