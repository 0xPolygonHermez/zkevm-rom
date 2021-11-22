

start:
                        RESET
                        COMMITZERO                          ; Commit a NOOP so it's valid

nextOp:
    ${done()}               JMPI done

    $$(resetHash())
    $$(var level=getMaxLevel())
    ${readOrWrite()}        JMPI write

read: 
    ${VisZero}              JMPI readNotExistance
                            JMP  readExistance
 
write:
    ${isDeleteOrInsert()}   JMPI isDeleteOrInsert
                            JMP  isUpdate

isDeleteOrInsert:

    ${kNew()}           LOADK_NEW
    ${v(3)}             LOAD, JMPI loadNZ2
    ${v(2)}             LOAD, JMPI loadNZ1
    ${v(1)}             LOAD, JMPI loadNZ0
    ${v(0)}             LOAD, JMPI loadNZdone
                        JMP fail
loadNZ2:
    ${v(2)}             LOAD
loadNZ1:
    ${v(1)}             LOAD
loadNZ0:
    ${v(0)}             LOAD
loadNZdone:
                        HASHV_NEW
                        LATCHV

    ${kOldIns()}        LOADK_OLD, JMPI oldInsIsNotZero        ; If key is 0 then JMP to oldInsIsZero
                        JMP oldInsIsZero                       

oldInsIsNotZero:                                               ; A new node needs to be maked with the two keys
    ${vOldIns(3)}       LOAD, JMPI loadOIZ2                ; Load the oldIns
    ${vOldIns(2)}       LOAD, JMPI loadOIZ1
    ${vOldIns(1)}       LOAD, JMPI loadOIZ0
    ${vOldIns(0)}       LOAD, JMPI loadOIZdone
                        JMP fail
loadOIZ2:
    ${v(2)}             LOAD
loadOIZ1:
    ${v(1)}             LOAD
loadOIZ0:
    ${v(0)}             LOAD
loadOIZdone:
                        HASHV_OLD

    ${kStepOld(level)}  LOADKSTEP
                        ACCK_OLD

    ${kStepNew(level)}  LOADKSTEP
                        ACCK_NEW

                        HASHS_NEW
                        $${level = level-1}


loopSubPath:
    ${isTrunk()}        JMPI isTrunk

                        RESET_S

    ${kStepNew(level)}  LOADKSTEP
                        ACCK_OLD
                        ACCK_NEW

                        HASHS_NEW
                        $${level = level-1}

                        JMP loopSubPath

isTrunk:
                        HASHV_OLD
                        JMP nextMainLevel

oldIsZero:
    ${vOld(3)}          LOAD, JMPI loadOZ2                ; Load the oldIns
    ${vOld(2)}          LOAD, JMPI loadOZ1
    ${vOld(1)}          LOAD, JMPI loadOZ0
    ${vOld(0)}          LOAD, JMPI loadOZdone
                        JMP fail
loadOZ2:
    ${v(2)}             LOAD
loadOZ1:
    ${v(1)}             LOAD
loadOZ0:
    ${v(0)}             LOAD
loadOZdone:
                        HASHV

                        JMP nextMainLevel

isUpdate:

    ${kNew()}           LOADK_NEWOLD

    ${v(3)}             LOAD, JMPI loadUNZ2
    ${v(2)}             LOAD, JMPI loadUNZ1
    ${v(1)}             LOAD, JMPI loadUNZ0
    ${v(0)}             LOAD, JMPI loadUNZdone
                        JMP nextMainLevel
loadUNZ2:
    ${v(2)}             LOAD
loadUNZ1:
    ${v(1)}             LOAD
loadUNZ0:
    ${v(0)}             LOAD
loadUNZdone:
                        HASHV_NEW
                        LATCHV

    ${kOldIns()}        LOADK_OLD, JMPI oldInsIsNotZero        ; If key is 0 then JMP to oldInsIsZero
                        JMP oldInsIsZero                       

oldInsIsNotZero:                                               ; A new node needs to be maked with the two keys
    ${vOldIns(3)}       LOAD, JMPI loadOIZ2                ; Load the oldIns
    ${vOldIns(2)}       LOAD, JMPI loadOIZ1
    ${vOldIns(1)}       LOAD, JMPI loadOIZ0
    ${vOldIns(0)}       LOAD, JMPI loadOIZdone
                        JMP fail
loadOIZ2:
    ${v(2)}             LOAD
loadOIZ1:
    ${v(1)}             LOAD
loadOIZ0:
    ${v(0)}             LOAD
loadOIZdone:
                        HASHV


nextMainLevel:
    ${level==0}                 JMPI isRoot

    ${loadSibling(level, 15)}   LOAD
    ${loadSibling(level, 14)}   LOAD
    ${loadSibling(level, 13)}   LOAD
    ${loadSibling(level, 12)}   LOAD
    ${loadSibling(level, 11)}   LOAD
    ${loadSibling(level, 10)}   LOAD
    ${loadSibling(level, 9)}    LOAD
    ${loadSibling(level, 8)}    LOAD
    ${loadSibling(level, 7)}    LOAD
    ${loadSibling(level, 6)}    LOAD
    ${loadSibling(level, 5)}    LOAD
    ${loadSibling(level, 4)}    LOAD
    ${loadSibling(level, 3)}    LOAD
    ${loadSibling(level, 2)}    LOAD
    ${loadSibling(level, 1)}    LOAD
    ${loadSibling(level, 0)}    LOAD

    ${kStepNew(level)}          LOADKSTEP
                                ACCK_OLD
                                HASHS_OLD
                                ACCK_NEW
                                HASHS_NEW
                                $${level = level-1}
                                JMP nextMainLevel

isRoot:
    ${invert()}                 JMPI commitInvert

                                COMMITWRITE
                                JMP nextOp

commitInvert:
                                RESET_V
                                LATCHV
                                COMMITWRITEINVERTED
                                JMP nextOp


read:

    ${kNew()}           LOADK_NEWOLD

    ${v(3)}             LOAD, JMPI loadRZ2
    ${v(2)}             LOAD, JMPI loadRZ1
    ${v(1)}             LOAD, JMPI loadRZ0
    ${v(0)}             LOAD, JMPI loadRZdone
                        JMP readNextMainLevel
loadRZ2:
    ${v(2)}             LOAD
loadRZ1:
    ${v(1)}             LOAD
loadRZ0:
    ${v(0)}             LOAD
loadRZdone:
                        HASHV_NEW
                        LATCHV

readNextMainLevel:

    ${level==0}                 JMPI readIsRoot

    ${loadSibling(level, 15)}   LOAD
    ${loadSibling(level, 14)}   LOAD
    ${loadSibling(level, 13)}   LOAD
    ${loadSibling(level, 12)}   LOAD
    ${loadSibling(level, 11)}   LOAD
    ${loadSibling(level, 10)}   LOAD
    ${loadSibling(level, 9)}    LOAD
    ${loadSibling(level, 8)}    LOAD
    ${loadSibling(level, 7)}    LOAD
    ${loadSibling(level, 6)}    LOAD
    ${loadSibling(level, 5)}    LOAD
    ${loadSibling(level, 4)}    LOAD
    ${loadSibling(level, 3)}    LOAD
    ${loadSibling(level, 2)}    LOAD
    ${loadSibling(level, 1)}    LOAD
    ${loadSibling(level, 0)}    LOAD

    ${kStepNew(level)}          LOADKSTEP
                                ACCK_NEW
                                HASHS_NEW
                                $${level = level-1}
                                JMP nextMainLevel

readIsRoot:
                                COMMITREAD
                                JMP nextOp


fail:
                                $${failed()}
                                JMP nextOp













