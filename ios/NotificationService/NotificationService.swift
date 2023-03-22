//
//  NotificationService.swift
//  NotificationService
//
//  Created by Ankita on 15/12/22.
//

import UserNotifications

class NotificationService: UNNotificationServiceExtension {
    
    var contentHandler: ((UNNotificationContent) -> Void)?
    var bestAttemptContent: UNMutableNotificationContent?
    //let manager = PhoneBookManager()
    //var contacts:[UserContactModel] = []
    
    override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
        
        print("We are reciving..")
        
        self.contentHandler = contentHandler
        bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
        let userInfo = request.content.userInfo
        let dataDict = userInfo as NSDictionary? ?? [:]
        let responseDict = dataDict.value(forKey: "sendbird") as? NSDictionary ?? [:]
        let senderDic = responseDict.value(forKey: "sender") as? NSDictionary ?? [:]
        let metaDic = senderDic.value(forKey: "metadata") as? NSDictionary ?? [:]
        let phone = metaDic.value(forKey: "phone") as? String ?? ""
        
        if let bestAttemptContent = bestAttemptContent {
            let type:String = responseDict["type"] as? String ?? ""
            if type == "MESG"{
                bestAttemptContent.body = responseDict["message"] as? String ?? ""
            }else{
                bestAttemptContent.body = "\(bestAttemptContent.body.components(separatedBy: ":").last?.trimmingCharacters(in: .whitespacesAndNewlines) ?? "") recieved"
            }
            print("The phone number issue is here",phone)
            if (responseDict.value(forKey: "channel_type") as? String ?? "") == "messaging"{
                //let _ = manager.setupNameOrNumberForNotification(phoneNumber: phone, isForChatDisplay: true, completion: { name in
                    print("name is \(phone)")
                    bestAttemptContent.title = "\(phone)"
                    contentHandler(bestAttemptContent)
                //})
            }else{
                //let _ = manager.setupNameOrNumberForNotification(phoneNumber: phone, isForChatDisplay: true, completion: {[weak self] senderName in
                    //guard let self = self else { return  }
                    print("name is \(phone)")
                    let senderName = phone.trimmingCharacters(in: .whitespacesAndNewlines)
                    if (responseDict.value(forKey: "mentioned_users") as? NSArray ?? NSArray()).count == 0{
                        print("========= \(responseDict.value(forKey: "message") as? String ?? ""))")
                        if (responseDict.value(forKey: "message") as? String ?? "").contains("@Channel") || (responseDict.value(forKey: "message") as? String ?? "").contains("@Group"){
                            var newText:String = responseDict.value(forKey: "message") as? String ?? ""
                            let data:[String] = newText.components(separatedBy: " ").filter{$0.contains("@")}.compactMap{$0.replacingOccurrences(of: "@", with: "")}
                            //let arrTag:[String] = data.compactMap{"@\(self.manager.setupNameOrNumberForNotification(phoneNumber:$0, isForChatDisplay: true))"}
                            //for i in 0 ..< arrTag.count{
                            //    let name:String = arrTag[i]
                            //    if newText.contains("@\(data[i])"){
                            //        newText = newText.replacingOccurrences(of:"@\(data[i])", with: name)
                            //    }else{
                            //        newText = newText.replacingOccurrences(of: data[i], with: name)
                            //    }
                            //}
                            bestAttemptContent.body = "\(phone): \(newText)"
                            bestAttemptContent.title = "\((responseDict.value(forKey: "channel") as? NSDictionary ?? NSDictionary()).value(forKey: "name") as? String ?? "")"
                            contentHandler(bestAttemptContent)
                        }else{
                            bestAttemptContent.body = "\(phone): \(bestAttemptContent.body)"
                            bestAttemptContent.title = "\((responseDict.value(forKey: "channel") as? NSDictionary ?? NSDictionary()).value(forKey: "name") as? String ?? "")"
                            contentHandler(bestAttemptContent)
                        }
                        
                    }else{
                        var newText:String = responseDict.value(forKey: "message") as? String ?? ""
                        let data:[String] = newText.components(separatedBy: " ").filter{$0.contains("@")}.compactMap{$0.replacingOccurrences(of: "@", with: "")}
                        //let arrTag:[String] = data.compactMap{"@\(self.manager.setupNameOrNumberForNotification(phoneNumber:$0, isForChatDisplay: true))"}
                        //for i in 0 ..< arrTag.count{
                        //    let name:String = arrTag[i]
                        //    if newText.contains("@\(data[i])"){
                        //        newText = newText.replacingOccurrences(of:"@\(data[i])", with: name)
                        //    }else{
                        //        newText = newText.replacingOccurrences(of: data[i], with: name)
                        //    }
                        //}
                        
                        bestAttemptContent.body = "\(phone): \(newText)"
                        bestAttemptContent.title = "\((responseDict.value(forKey: "channel") as? NSDictionary ?? NSDictionary()).value(forKey: "name") as? String ?? "")"
                        contentHandler(bestAttemptContent)
                    }
                //})
            }
            
        }
    }
    
    
    override func serviceExtensionTimeWillExpire() {
        // Called just before the extension will be terminated by the system.
        // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
        if let contentHandler = contentHandler, let bestAttemptContent =  bestAttemptContent {
            contentHandler(bestAttemptContent)
        }
    }
}

