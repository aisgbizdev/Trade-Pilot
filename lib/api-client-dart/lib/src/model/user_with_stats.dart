//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'user_with_stats.g.dart';

/// UserWithStats
///
/// Properties:
/// * [id] 
/// * [email] 
/// * [displayName] 
/// * [role] 
/// * [selectedMode] 
/// * [analysisCount] 
/// * [tags] 
/// * [customQuotaPerHour] - Per-user analysis-quota override. Null = uses the global default.
/// * [customQuotaPerDay] - Per-user analysis-quota override. Null = uses the global default.
/// * [createdAt] 
@BuiltValue()
abstract class UserWithStats implements Built<UserWithStats, UserWithStatsBuilder> {
  @BuiltValueField(wireName: r'id')
  int get id;

  @BuiltValueField(wireName: r'email')
  String get email;

  @BuiltValueField(wireName: r'displayName')
  String get displayName;

  @BuiltValueField(wireName: r'role')
  UserWithStatsRoleEnum get role;
  // enum roleEnum {  user,  admin,  super_admin,  };

  @BuiltValueField(wireName: r'selectedMode')
  UserWithStatsSelectedModeEnum get selectedMode;
  // enum selectedModeEnum {  beginner,  pro,  };

  @BuiltValueField(wireName: r'analysisCount')
  int get analysisCount;

  @BuiltValueField(wireName: r'tags')
  BuiltList<String> get tags;

  /// Per-user analysis-quota override. Null = uses the global default.
  @BuiltValueField(wireName: r'customQuotaPerHour')
  int? get customQuotaPerHour;

  /// Per-user analysis-quota override. Null = uses the global default.
  @BuiltValueField(wireName: r'customQuotaPerDay')
  int? get customQuotaPerDay;

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  UserWithStats._();

  factory UserWithStats([void updates(UserWithStatsBuilder b)]) = _$UserWithStats;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UserWithStatsBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UserWithStats> get serializer => _$UserWithStatsSerializer();
}

class _$UserWithStatsSerializer implements PrimitiveSerializer<UserWithStats> {
  @override
  final Iterable<Type> types = const [UserWithStats, _$UserWithStats];

  @override
  final String wireName = r'UserWithStats';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UserWithStats object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(int),
    );
    yield r'email';
    yield serializers.serialize(
      object.email,
      specifiedType: const FullType(String),
    );
    yield r'displayName';
    yield serializers.serialize(
      object.displayName,
      specifiedType: const FullType(String),
    );
    yield r'role';
    yield serializers.serialize(
      object.role,
      specifiedType: const FullType(UserWithStatsRoleEnum),
    );
    yield r'selectedMode';
    yield serializers.serialize(
      object.selectedMode,
      specifiedType: const FullType(UserWithStatsSelectedModeEnum),
    );
    yield r'analysisCount';
    yield serializers.serialize(
      object.analysisCount,
      specifiedType: const FullType(int),
    );
    yield r'tags';
    yield serializers.serialize(
      object.tags,
      specifiedType: const FullType(BuiltList, [FullType(String)]),
    );
    if (object.customQuotaPerHour != null) {
      yield r'customQuotaPerHour';
      yield serializers.serialize(
        object.customQuotaPerHour,
        specifiedType: const FullType(int),
      );
    }
    if (object.customQuotaPerDay != null) {
      yield r'customQuotaPerDay';
      yield serializers.serialize(
        object.customQuotaPerDay,
        specifiedType: const FullType(int),
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
    UserWithStats object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UserWithStatsBuilder result,
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
        case r'email':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.email = valueDes;
          break;
        case r'displayName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.displayName = valueDes;
          break;
        case r'role':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(UserWithStatsRoleEnum),
          ) as UserWithStatsRoleEnum;
          result.role = valueDes;
          break;
        case r'selectedMode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(UserWithStatsSelectedModeEnum),
          ) as UserWithStatsSelectedModeEnum;
          result.selectedMode = valueDes;
          break;
        case r'analysisCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.analysisCount = valueDes;
          break;
        case r'tags':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(String)]),
          ) as BuiltList<String>;
          result.tags.replace(valueDes);
          break;
        case r'customQuotaPerHour':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(int),
          ) as int?;
          if (valueDes == null) continue;
          result.customQuotaPerHour = valueDes;
          break;
        case r'customQuotaPerDay':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(int),
          ) as int?;
          if (valueDes == null) continue;
          result.customQuotaPerDay = valueDes;
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
  UserWithStats deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UserWithStatsBuilder();
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

class UserWithStatsRoleEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'user')
  static const UserWithStatsRoleEnum user = _$userWithStatsRoleEnum_user;
  @BuiltValueEnumConst(wireName: r'admin')
  static const UserWithStatsRoleEnum admin = _$userWithStatsRoleEnum_admin;
  @BuiltValueEnumConst(wireName: r'super_admin')
  static const UserWithStatsRoleEnum superAdmin = _$userWithStatsRoleEnum_superAdmin;

  static Serializer<UserWithStatsRoleEnum> get serializer => _$userWithStatsRoleEnumSerializer;

  const UserWithStatsRoleEnum._(String name): super(name);

  static BuiltSet<UserWithStatsRoleEnum> get values => _$userWithStatsRoleEnumValues;
  static UserWithStatsRoleEnum valueOf(String name) => _$userWithStatsRoleEnumValueOf(name);
}

class UserWithStatsSelectedModeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'beginner')
  static const UserWithStatsSelectedModeEnum beginner = _$userWithStatsSelectedModeEnum_beginner;
  @BuiltValueEnumConst(wireName: r'pro')
  static const UserWithStatsSelectedModeEnum pro = _$userWithStatsSelectedModeEnum_pro;

  static Serializer<UserWithStatsSelectedModeEnum> get serializer => _$userWithStatsSelectedModeEnumSerializer;

  const UserWithStatsSelectedModeEnum._(String name): super(name);

  static BuiltSet<UserWithStatsSelectedModeEnum> get values => _$userWithStatsSelectedModeEnumValues;
  static UserWithStatsSelectedModeEnum valueOf(String name) => _$userWithStatsSelectedModeEnumValueOf(name);
}

