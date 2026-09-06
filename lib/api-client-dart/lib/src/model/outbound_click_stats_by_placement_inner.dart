//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'outbound_click_stats_by_placement_inner.g.dart';

/// OutboundClickStatsByPlacementInner
///
/// Properties:
/// * [placement] 
/// * [target] 
/// * [count] 
@BuiltValue()
abstract class OutboundClickStatsByPlacementInner implements Built<OutboundClickStatsByPlacementInner, OutboundClickStatsByPlacementInnerBuilder> {
  @BuiltValueField(wireName: r'placement')
  String get placement;

  @BuiltValueField(wireName: r'target')
  String get target;

  @BuiltValueField(wireName: r'count')
  int get count;

  OutboundClickStatsByPlacementInner._();

  factory OutboundClickStatsByPlacementInner([void updates(OutboundClickStatsByPlacementInnerBuilder b)]) = _$OutboundClickStatsByPlacementInner;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(OutboundClickStatsByPlacementInnerBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<OutboundClickStatsByPlacementInner> get serializer => _$OutboundClickStatsByPlacementInnerSerializer();
}

class _$OutboundClickStatsByPlacementInnerSerializer implements PrimitiveSerializer<OutboundClickStatsByPlacementInner> {
  @override
  final Iterable<Type> types = const [OutboundClickStatsByPlacementInner, _$OutboundClickStatsByPlacementInner];

  @override
  final String wireName = r'OutboundClickStatsByPlacementInner';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    OutboundClickStatsByPlacementInner object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'placement';
    yield serializers.serialize(
      object.placement,
      specifiedType: const FullType(String),
    );
    yield r'target';
    yield serializers.serialize(
      object.target,
      specifiedType: const FullType(String),
    );
    yield r'count';
    yield serializers.serialize(
      object.count,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    OutboundClickStatsByPlacementInner object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required OutboundClickStatsByPlacementInnerBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'placement':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.placement = valueDes;
          break;
        case r'target':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.target = valueDes;
          break;
        case r'count':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.count = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  OutboundClickStatsByPlacementInner deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = OutboundClickStatsByPlacementInnerBuilder();
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

