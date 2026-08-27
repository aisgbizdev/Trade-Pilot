//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'notification.g.dart';

/// Notification
///
/// Properties:
/// * [id] 
/// * [userId] 
/// * [targetRole] 
/// * [title] 
/// * [message] 
/// * [type] 
/// * [readAt] 
/// * [category] - Category slug used by the anti-annoyance/frequency-cap engine (e.g. \"market_news\", \"security_alert\"). Informational for clients — not itself a tap-target.
/// * [actionType] - Allowlisted tap-target. Clients should treat any value they don't recognise the same as null (no special action, just mark read) so new action types can be added without breaking older clients.
/// * [actionId] - The id `actionType` refers to (e.g. an analysis id for \"open_analysis\").
/// * [createdAt] 
@BuiltValue()
abstract class Notification implements Built<Notification, NotificationBuilder> {
  @BuiltValueField(wireName: r'id')
  int get id;

  @BuiltValueField(wireName: r'userId')
  int? get userId;

  @BuiltValueField(wireName: r'targetRole')
  String? get targetRole;

  @BuiltValueField(wireName: r'title')
  String get title;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'type')
  NotificationTypeEnum get type;
  // enum typeEnum {  info,  warning,  error,  };

  @BuiltValueField(wireName: r'readAt')
  DateTime? get readAt;

  /// Category slug used by the anti-annoyance/frequency-cap engine (e.g. \"market_news\", \"security_alert\"). Informational for clients — not itself a tap-target.
  @BuiltValueField(wireName: r'category')
  String? get category;

  /// Allowlisted tap-target. Clients should treat any value they don't recognise the same as null (no special action, just mark read) so new action types can be added without breaking older clients.
  @BuiltValueField(wireName: r'actionType')
  NotificationActionTypeEnum? get actionType;
  // enum actionTypeEnum {  open_notification,  open_analysis,  };

  /// The id `actionType` refers to (e.g. an analysis id for \"open_analysis\").
  @BuiltValueField(wireName: r'actionId')
  String? get actionId;

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  Notification._();

  factory Notification([void updates(NotificationBuilder b)]) = _$Notification;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(NotificationBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<Notification> get serializer => _$NotificationSerializer();
}

class _$NotificationSerializer implements PrimitiveSerializer<Notification> {
  @override
  final Iterable<Type> types = const [Notification, _$Notification];

  @override
  final String wireName = r'Notification';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    Notification object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(int),
    );
    if (object.userId != null) {
      yield r'userId';
      yield serializers.serialize(
        object.userId,
        specifiedType: const FullType(int),
      );
    }
    if (object.targetRole != null) {
      yield r'targetRole';
      yield serializers.serialize(
        object.targetRole,
        specifiedType: const FullType(String),
      );
    }
    yield r'title';
    yield serializers.serialize(
      object.title,
      specifiedType: const FullType(String),
    );
    yield r'message';
    yield serializers.serialize(
      object.message,
      specifiedType: const FullType(String),
    );
    yield r'type';
    yield serializers.serialize(
      object.type,
      specifiedType: const FullType(NotificationTypeEnum),
    );
    if (object.readAt != null) {
      yield r'readAt';
      yield serializers.serialize(
        object.readAt,
        specifiedType: const FullType(DateTime),
      );
    }
    if (object.category != null) {
      yield r'category';
      yield serializers.serialize(
        object.category,
        specifiedType: const FullType(String),
      );
    }
    if (object.actionType != null) {
      yield r'actionType';
      yield serializers.serialize(
        object.actionType,
        specifiedType: const FullType(NotificationActionTypeEnum),
      );
    }
    if (object.actionId != null) {
      yield r'actionId';
      yield serializers.serialize(
        object.actionId,
        specifiedType: const FullType(String),
      );
    }
    yield r'createdAt';
    yield serializers.serialize(
      object.createdAt,
      specifiedType: const FullType(DateTime),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    Notification object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required NotificationBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.id = valueDes;
          break;
        case r'userId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(int),
          ) as int?;
          if (valueDes == null) continue;
          result.userId = valueDes;
          break;
        case r'targetRole':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.targetRole = valueDes;
          break;
        case r'title':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.title = valueDes;
          break;
        case r'message':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.message = valueDes;
          break;
        case r'type':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(NotificationTypeEnum),
          ) as NotificationTypeEnum;
          result.type = valueDes;
          break;
        case r'readAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.readAt = valueDes;
          break;
        case r'category':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.category = valueDes;
          break;
        case r'actionType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(NotificationActionTypeEnum),
          ) as NotificationActionTypeEnum?;
          if (valueDes == null) continue;
          result.actionType = valueDes;
          break;
        case r'actionId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.actionId = valueDes;
          break;
        case r'createdAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.createdAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  Notification deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = NotificationBuilder();
    final serializedList = (serialized as Iterable<Object?>).toList();
    final unhandled = <Object?>[];
    _deserializeProperties(
      serializers,
      serialized,
      specifiedType: specifiedType,
      serializedList: serializedList,
      unhandled: unhandled,
      result: result,
    );
    return result.build();
  }
}

class NotificationTypeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'info')
  static const NotificationTypeEnum info = _$notificationTypeEnum_info;
  @BuiltValueEnumConst(wireName: r'warning')
  static const NotificationTypeEnum warning = _$notificationTypeEnum_warning;
  @BuiltValueEnumConst(wireName: r'error')
  static const NotificationTypeEnum error = _$notificationTypeEnum_error;

  static Serializer<NotificationTypeEnum> get serializer => _$notificationTypeEnumSerializer;

  const NotificationTypeEnum._(String name): super(name);

  static BuiltSet<NotificationTypeEnum> get values => _$notificationTypeEnumValues;
  static NotificationTypeEnum valueOf(String name) => _$notificationTypeEnumValueOf(name);
}

class NotificationActionTypeEnum extends EnumClass {

  /// Allowlisted tap-target. Clients should treat any value they don't recognise the same as null (no special action, just mark read) so new action types can be added without breaking older clients.
  @BuiltValueEnumConst(wireName: r'open_notification')
  static const NotificationActionTypeEnum openNotification = _$notificationActionTypeEnum_openNotification;
  /// Allowlisted tap-target. Clients should treat any value they don't recognise the same as null (no special action, just mark read) so new action types can be added without breaking older clients.
  @BuiltValueEnumConst(wireName: r'open_analysis')
  static const NotificationActionTypeEnum openAnalysis = _$notificationActionTypeEnum_openAnalysis;

  static Serializer<NotificationActionTypeEnum> get serializer => _$notificationActionTypeEnumSerializer;

  const NotificationActionTypeEnum._(String name): super(name);

  static BuiltSet<NotificationActionTypeEnum> get values => _$notificationActionTypeEnumValues;
  static NotificationActionTypeEnum valueOf(String name) => _$notificationActionTypeEnumValueOf(name);
}

