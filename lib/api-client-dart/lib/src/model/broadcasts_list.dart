//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/broadcast.dart';
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'broadcasts_list.g.dart';

/// BroadcastsList
///
/// Properties:
/// * [broadcasts] 
/// * [total] 
/// * [page] 
/// * [limit] 
@BuiltValue()
abstract class BroadcastsList implements Built<BroadcastsList, BroadcastsListBuilder> {
  @BuiltValueField(wireName: r'broadcasts')
  BuiltList<Broadcast> get broadcasts;

  @BuiltValueField(wireName: r'total')
  int get total;

  @BuiltValueField(wireName: r'page')
  int get page;

  @BuiltValueField(wireName: r'limit')
  int get limit;

  BroadcastsList._();

  factory BroadcastsList([void updates(BroadcastsListBuilder b)]) = _$BroadcastsList;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(BroadcastsListBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<BroadcastsList> get serializer => _$BroadcastsListSerializer();
}

class _$BroadcastsListSerializer implements PrimitiveSerializer<BroadcastsList> {
  @override
  final Iterable<Type> types = const [BroadcastsList, _$BroadcastsList];

  @override
  final String wireName = r'BroadcastsList';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    BroadcastsList object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'broadcasts';
    yield serializers.serialize(
      object.broadcasts,
      specifiedType: const FullType(BuiltList, [FullType(Broadcast)]),
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
    BroadcastsList object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required BroadcastsListBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'broadcasts':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(Broadcast)]),
          ) as BuiltList<Broadcast>;
          result.broadcasts.replace(valueDes);
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
  BroadcastsList deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = BroadcastsListBuilder();
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

