//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'add_watchlist_body.g.dart';

/// AddWatchlistBody
///
/// Properties:
/// * [instrument] 
@BuiltValue()
abstract class AddWatchlistBody implements Built<AddWatchlistBody, AddWatchlistBodyBuilder> {
  @BuiltValueField(wireName: r'instrument')
  String get instrument;

  AddWatchlistBody._();

  factory AddWatchlistBody([void updates(AddWatchlistBodyBuilder b)]) = _$AddWatchlistBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AddWatchlistBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AddWatchlistBody> get serializer => _$AddWatchlistBodySerializer();
}

class _$AddWatchlistBodySerializer implements PrimitiveSerializer<AddWatchlistBody> {
  @override
  final Iterable<Type> types = const [AddWatchlistBody, _$AddWatchlistBody];

  @override
  final String wireName = r'AddWatchlistBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AddWatchlistBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'instrument';
    yield serializers.serialize(
      object.instrument,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AddWatchlistBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AddWatchlistBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'instrument':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.instrument = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AddWatchlistBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AddWatchlistBodyBuilder();
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

