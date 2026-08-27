//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/user_with_stats.dart';
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'users_list.g.dart';

/// UsersList
///
/// Properties:
/// * [users] 
/// * [total] 
/// * [page] 
/// * [limit] 
@BuiltValue()
abstract class UsersList implements Built<UsersList, UsersListBuilder> {
  @BuiltValueField(wireName: r'users')
  BuiltList<UserWithStats> get users;

  @BuiltValueField(wireName: r'total')
  int get total;

  @BuiltValueField(wireName: r'page')
  int get page;

  @BuiltValueField(wireName: r'limit')
  int get limit;

  UsersList._();

  factory UsersList([void updates(UsersListBuilder b)]) = _$UsersList;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UsersListBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UsersList> get serializer => _$UsersListSerializer();
}

class _$UsersListSerializer implements PrimitiveSerializer<UsersList> {
  @override
  final Iterable<Type> types = const [UsersList, _$UsersList];

  @override
  final String wireName = r'UsersList';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UsersList object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'users';
    yield serializers.serialize(
      object.users,
      specifiedType: const FullType(BuiltList, [FullType(UserWithStats)]),
    );
    yield r'total';
    yield serializers.serialize(
      object.total,
      specifiedType: const FullType(int),
    );
    yield r'page';
    yield serializers.serialize(
      object.page,
      specifiedType: const FullType(int),
    );
    yield r'limit';
    yield serializers.serialize(
      object.limit,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    UsersList object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UsersListBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'users':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(UserWithStats)]),
          ) as BuiltList<UserWithStats>;
          result.users.replace(valueDes);
          break;
        case r'total':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.total = valueDes;
          break;
        case r'page':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.page = valueDes;
          break;
        case r'limit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.limit = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UsersList deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UsersListBuilder();
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

