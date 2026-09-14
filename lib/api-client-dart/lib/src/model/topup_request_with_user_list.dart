//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/topup_request_with_user.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'topup_request_with_user_list.g.dart';

/// TopupRequestWithUserList
///
/// Properties:
/// * [requests] 
/// * [total] 
/// * [page] 
/// * [limit] 
@BuiltValue()
abstract class TopupRequestWithUserList implements Built<TopupRequestWithUserList, TopupRequestWithUserListBuilder> {
  @BuiltValueField(wireName: r'requests')
  BuiltList<TopupRequestWithUser> get requests;

  @BuiltValueField(wireName: r'total')
  int get total;

  @BuiltValueField(wireName: r'page')
  int get page;

  @BuiltValueField(wireName: r'limit')
  int get limit;

  TopupRequestWithUserList._();

  factory TopupRequestWithUserList([void updates(TopupRequestWithUserListBuilder b)]) = _$TopupRequestWithUserList;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TopupRequestWithUserListBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TopupRequestWithUserList> get serializer => _$TopupRequestWithUserListSerializer();
}

class _$TopupRequestWithUserListSerializer implements PrimitiveSerializer<TopupRequestWithUserList> {
  @override
  final Iterable<Type> types = const [TopupRequestWithUserList, _$TopupRequestWithUserList];

  @override
  final String wireName = r'TopupRequestWithUserList';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TopupRequestWithUserList object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'requests';
    yield serializers.serialize(
      object.requests,
      specifiedType: const FullType(BuiltList, [FullType(TopupRequestWithUser)]),
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
    TopupRequestWithUserList object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TopupRequestWithUserListBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'requests':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(TopupRequestWithUser)]),
          ) as BuiltList<TopupRequestWithUser>;
          result.requests.replace(valueDes);
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
  TopupRequestWithUserList deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TopupRequestWithUserListBuilder();
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

